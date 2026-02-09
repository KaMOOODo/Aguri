(function (global) {
  'use strict';

  const DEFAULT_EXCEL_URL = 'https://a.assecobs.com/accounts/aguri/stock/konfigurator/cars.xlsx';

  const ConfiguratorData = (() => {
    let db = null;

    function normalizeYear(value) {
      if (value == null || value === '') return [];
      if (typeof value === 'string' && value.includes('-')) {
        const [from, to] = value.split('-').map(v => Number(String(v).trim()));
        if (!Number.isFinite(from) || !Number.isFinite(to)) return [String(value)];
        const years = [];
        for (let y = from; y <= to; y++) years.push(String(y));
        return years;
      }
      return [String(value).trim()];
    }

    function normalizeKey(key) {
      return String(key)
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '');
    }

    function getValue(row, aliases) {
      for (const alias of aliases) {
        if (row[alias] != null && row[alias] !== '') return row[alias];
      }
      const map = {};
      Object.keys(row).forEach(k => { map[normalizeKey(k)] = k; });
      for (const alias of aliases) {
        const hit = map[normalizeKey(alias)];
        if (hit && row[hit] != null && row[hit] !== '') return row[hit];
      }
      return '';
    }

    function ensure(obj, key) {
      if (!obj[key]) obj[key] = {};
      return obj[key];
    }

    async function loadExcel(url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Excel load failed');
      const buf = await res.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      return XLSX.utils.sheet_to_json(ws, { defval: '' });
    }

    function buildDatabase(rows) {
      const root = {};

      rows.forEach(row => {
        const marka = getValue(row, ['MARKA', 'Marka', 'MAKE', 'Make']);
        const model = getValue(row, ['MODEL', 'Model']);
        const body  = getValue(row, ['WERSJA NADWOZIA', 'WERSJA NADWOZIA ', 'WERSJA NADWOZIA/']);
        const mount = getValue(row, ['WERSJA MONTAŻU', 'WERSJA MONTAZU', 'MONTAŻ', 'MONTAZU']) || '_NONE_';
        const years = normalizeYear(getValue(row, ['ROK PRODUKCJI', 'Rok Produkcji', 'ROK']));

        if (!marka || !model || !body) return;

        years.forEach(year => {
          const node =
            ensure(
              ensure(
                ensure(
                  ensure(root, marka),
                  model
                ),
                body
              ),
              year
            );

          const leaf = ensure(node, mount);
          leaf.prestige ??= new Set();
          leaf.runner   ??= new Set();

          if (row.PRESTIGE) leaf.prestige.add(row.PRESTIGE);
          if (row.RUNNER)   leaf.runner.add(row.RUNNER);
        });
      });

      return root;
    }

    async function init(excelUrl) {
      const rows = await loadExcel(excelUrl);
      db = buildDatabase(rows);
    }

    function find(sel) {
      const n =
        db?.[sel.marka]
          ?.[sel.model]
          ?.[sel.wersjaNadwozia]
          ?.[sel.rokProdukcji]
          ?.[sel.wersjaMontazu || '_NONE_'];

      return {
        prestige: Array.from(n?.prestige || []),
        runner:   Array.from(n?.runner   || [])
      };
    }

    return {
      init,
      find,
      getDB: () => db,
      isReady: () => !!db
    };
  })();

  function createApp(excelUrl) {
    const el = {};
    let database;

    function qs(id){ return document.getElementById(id); }

    function cache() {
      ['cfg-loading','cfg-error','cfg-error-text','cfg-form','cfg-results','cfg-products',
       'cfg-no-results','cfg-marka','cfg-model','cfg-wersja','cfg-rok','cfg-montaz',
       'cfg-search','cfg-reset','cfg-reset-no-results','cfg-retry-btn']
       .forEach(i => el[i.replace(/-/g,'')] = qs(i));
    }

    function show(key){
      ['loading','form','results','noResults','error'].forEach(k => {
        const node = el['cfg' + k];
        if (node?.style) node.style.display = 'none';
      });
      if (el[key]?.style) el[key].style.display = '';
    }

    function ensureMultiselect(sel) {
      if (global.jQuery && global.jQuery.fn && global.jQuery.fn.multiselect) {
        const $sel = global.jQuery(sel);
        if (!$sel.data('multiselect')) {
          $sel.multiselect();
        }
      }
    }

    function syncMultiselect(sel) {
      if (global.jQuery && global.jQuery.fn && global.jQuery.fn.multiselect) {
        const $sel = global.jQuery(sel);
        $sel.multiselect('rebuild');
        $sel.multiselect('enable');
      }
      const wrapper = sel.closest('.multiselect-native-select') || sel.parentElement;
      if (wrapper) {
        const btn = wrapper.querySelector('button.multiselect, button.dropdown-toggle');
        if (btn) {
          btn.disabled = false;
          btn.classList.remove('disabled');
        }
      }
    }

    function setSelectEnabled(sel, enabled) {
      sel.disabled = !enabled;
      if (global.jQuery && global.jQuery.fn && global.jQuery.fn.multiselect) {
        const $sel = global.jQuery(sel);
        if (enabled) {
          $sel.multiselect('enable');
        } else {
          $sel.multiselect('disable');
        }
      }
      const wrapper = sel.closest('.multiselect-native-select') || sel.parentElement;
      if (wrapper) {
        const btn = wrapper.querySelector('button.multiselect, button.dropdown-toggle');
        if (btn) {
          btn.disabled = !enabled;
          btn.classList.toggle('disabled', !enabled);
        }
      }
    }

    function populate(sel, arr){
      ensureMultiselect(sel);
      sel.innerHTML = '<option value="">---</option>';
      arr.forEach(v => sel.append(new Option(v,v)));
      setSelectEnabled(sel, true);
      syncMultiselect(sel);
    }

    function resetSelect(sel, disabled = true) {
      ensureMultiselect(sel);
      sel.innerHTML = '<option value="">---</option>';
      setSelectEnabled(sel, !disabled);
      if (global.jQuery && global.jQuery.fn && global.jQuery.fn.multiselect) {
        global.jQuery(sel).multiselect('rebuild');
      }
    }

    function clearResults() {
      el.cfgproducts.innerHTML = '';
    }

    function showForm() {
      clearResults();
      show('cfgform');
    }

    function updateSearchEnabled() {
      const ready =
        el.cfgmarka.value &&
        el.cfgmodel.value &&
        el.cfgwersja.value &&
        el.cfgrok.value &&
        el.cfgmontaz.value;
      el.cfgsearch.disabled = !ready;
    }

    function renderProducts(products) {
      clearResults();
      const items = [];
      products.prestige.forEach(p => items.push({ type: 'Prestige', code: p }));
      products.runner.forEach(p => items.push({ type: 'Runner', code: p }));

      if (!items.length) {
        show('cfgnoResults');
        return;
      }

      items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cfg-product-item';

        const badge = document.createElement('div');
        badge.className = 'cfg-product-badge';
        badge.textContent = item.type[0];

        const term = `${item.type} ${item.code}`;
        const href = `/search/text%3D${encodeURIComponent(term.toLowerCase())}/pl.html`;

        const info = document.createElement('div');
        info.innerHTML = `<a class="cfg-product-link" href="${href}" title="Szukaj: ${term}">
  <span class="cfg-product-text">${term}</span>
  <span class="cfg-product-search" aria-hidden="true">🔍</span>
</a>`;

        row.append(badge, info);
        el.cfgproducts.append(row);
      });

      show('cfgresults');
    }

    function bindChange(sel, handler) {
      sel.addEventListener('change', handler);
      if (global.jQuery) {
        const $sel = global.jQuery(sel);
        $sel.on('change', handler);
        $sel.closest('.multiselect-native-select').on('change', 'input', handler);
        $sel.closest('.multiselect-native-select').on('click', 'li a', handler);
      }
    }

    function bindEvents() {
      bindChange(el.cfgmarka, () => {
        resetSelect(el.cfgmodel);
        resetSelect(el.cfgwersja);
        resetSelect(el.cfgrok);
        resetSelect(el.cfgmontaz);
        updateSearchEnabled();
        showForm();

        const models = Object.keys(database?.[el.cfgmarka.value] || {});
        populate(el.cfgmodel, models);
      });

      bindChange(el.cfgmodel, () => {
        resetSelect(el.cfgwersja);
        resetSelect(el.cfgrok);
        resetSelect(el.cfgmontaz);
        updateSearchEnabled();
        showForm();

        const bodies = Object.keys(
          database?.[el.cfgmarka.value]?.[el.cfgmodel.value] || {}
        );
        populate(el.cfgwersja, bodies);
      });

      bindChange(el.cfgwersja, () => {
        resetSelect(el.cfgrok);
        resetSelect(el.cfgmontaz);
        updateSearchEnabled();
        showForm();

        const years = Object.keys(
          database?.[el.cfgmarka.value]?.[el.cfgmodel.value]?.[el.cfgwersja.value] || {}
        );
        populate(el.cfgrok, years);
      });

      bindChange(el.cfgrok, () => {
        resetSelect(el.cfgmontaz);
        updateSearchEnabled();
        showForm();

        const mounts = Object.keys(
          database?.[el.cfgmarka.value]?.[el.cfgmodel.value]?.[el.cfgwersja.value]?.[el.cfgrok.value] || {}
        );
        populate(el.cfgmontaz, mounts);
      });

      bindChange(el.cfgmontaz, updateSearchEnabled);

      el.cfgsearch.addEventListener('click', (e) => {
        e.preventDefault();
        const sel = {
          marka: el.cfgmarka.value,
          model: el.cfgmodel.value,
          wersjaNadwozia: el.cfgwersja.value,
          rokProdukcji: el.cfgrok.value,
          wersjaMontazu: el.cfgmontaz.value
        };
        renderProducts(ConfiguratorData.find(sel));
      });

      el.cfgreset.addEventListener('click', (e) => {
        e.preventDefault();
        el.cfgmarka.value = '';
        resetSelect(el.cfgmodel);
        resetSelect(el.cfgwersja);
        resetSelect(el.cfgrok);
        resetSelect(el.cfgmontaz);
        updateSearchEnabled();
        showForm();
      });

      el.cfgresetnoresults.addEventListener('click', (e) => {
        e.preventDefault();
        showForm();
      });

      el.cfgretrybtn.addEventListener('click', (e) => {
        e.preventDefault();
        init();
      });
    }

    async function init() {
      cache();
      [el.cfgmarka, el.cfgmodel, el.cfgwersja, el.cfgrok, el.cfgmontaz].forEach(ensureMultiselect);
      show('cfgloading');
      el.cfgsearch.disabled = true;
      el.cfgmarka.disabled = true;
      el.cfgmodel.disabled = true;
      el.cfgwersja.disabled = true;
      el.cfgrok.disabled = true;
      el.cfgmontaz.disabled = true;

      try {
        await ConfiguratorData.init(excelUrl);
        database = ConfiguratorData.getDB();
        populate(el.cfgmarka, Object.keys(database || {}));
        bindEvents();
        show('cfgform');
      } catch (e) {
        console.error(e);
        el.cfgerrortext.textContent = 'Błąd ładowania danych';
        show('cfgerror');
      }
    }

    return { init };
  }

  function bootstrap() {
    const excelUrl = DEFAULT_EXCEL_URL;
    if (!excelUrl) {
      const errText = document.getElementById('cfg-error-text');
      const err = document.getElementById('cfg-error');
      if (errText) errText.textContent = 'Błąd ładowania danych';
      if (err) err.style.display = '';
      return;
    }
    createApp(excelUrl).init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})(window);

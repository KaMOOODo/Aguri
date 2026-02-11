(function (global) {
  'use strict';

  const DEFAULT_EXCEL_URL = 'https://a.assecobs.com/accounts/aguri/stock/konfigurator/cars.xlsx';

  const ConfiguratorData = (() => {
    let db = null;

    function normalizeYear(value) {
      if (value == null || value === '') return [];
      const raw = String(value).trim().replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, '');
      if (!raw) return [];

      // Keep production year as one selector option (no expansion to separate years).
      // Supported forms: 2007, 2010-2013, 2014-, -2007
      if (/^\d{4}$/.test(raw)) return [raw];
      if (/^\d{4}-\d{4}$/.test(raw)) return [raw];
      if (/^\d{4}-$/.test(raw)) return [raw];
      if (/^-\d{4}$/.test(raw)) return [raw];

      // Fallback: keep unknown format as-is to avoid dropping source rows.
      return [raw];
    }

    function normalizeKey(key) {
      return String(key)
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '');
    }

    function normalizeText(value, { upper = false } = {}) {
      let out = String(value ?? '')
        .replace(/[\u00A0]/g, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (upper) out = out.toUpperCase();
      return out;
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
        const marka = normalizeText(getValue(row, ['MARKA', 'Marka', 'MAKE', 'Make']), { upper: true });
        const model = normalizeText(getValue(row, ['MODEL', 'Model']));
        const body  = normalizeText(getValue(row, ['WERSJA NADWOZIA', 'WERSJA NADWOZIA ', 'WERSJA NADWOZIA/']));
        const mountRaw = normalizeText(getValue(row, ['WERSJA MONTAŻU', 'WERSJA MONTAZU', 'MONTAŻ', 'MONTAZU']));
        const mount = mountRaw || '_NONE_';
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
      clear: () => { db = null; },
      getDB: () => db,
      isReady: () => !!db
    };
  })();

  function createApp(excelUrl) {
    const el = {};
    let database;
    let eventsBound = false;

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

    function populate(sel, arr){
      sel.innerHTML = '<option value="">---</option>';
      arr.forEach(v => sel.append(new Option(v,v)));
      sel.disabled = false;
    }

    function resetSelect(sel, disabled = true) {
      sel.innerHTML = '<option value="">---</option>';
      sel.disabled = disabled;
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

    function bindEvents() {
      if (eventsBound) return;
      eventsBound = true;

      el.cfgmarka.addEventListener('change', () => {
        resetSelect(el.cfgmodel);
        resetSelect(el.cfgwersja);
        resetSelect(el.cfgrok);
        resetSelect(el.cfgmontaz);
        updateSearchEnabled();
        showForm();

        const models = Object.keys(database?.[el.cfgmarka.value] || {});
        populate(el.cfgmodel, models);
      });

      el.cfgmodel.addEventListener('change', () => {
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

      el.cfgwersja.addEventListener('change', () => {
        resetSelect(el.cfgrok);
        resetSelect(el.cfgmontaz);
        updateSearchEnabled();
        showForm();

        const years = Object.keys(
          database?.[el.cfgmarka.value]?.[el.cfgmodel.value]?.[el.cfgwersja.value] || {}
        );
        populate(el.cfgrok, years);
      });

      el.cfgrok.addEventListener('change', () => {
        resetSelect(el.cfgmontaz);
        updateSearchEnabled();
        showForm();

        const mounts = Object.keys(
          database?.[el.cfgmarka.value]?.[el.cfgmodel.value]?.[el.cfgwersja.value]?.[el.cfgrok.value] || {}
        );
        populate(el.cfgmontaz, mounts);
      });

      el.cfgmontaz.addEventListener('change', updateSearchEnabled);

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
      stripMultiselect();
      setTimeout(stripMultiselect, 0);
      setTimeout(stripMultiselect, 250);
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

    async function hardReload() {
      ConfiguratorData.clear();
      await init();
    }

    function getState() {
      return {
        ready: ConfiguratorData.isReady(),
        selected: {
          marka: el.cfgmarka?.value || '',
          model: el.cfgmodel?.value || '',
          wersja: el.cfgwersja?.value || '',
          rok: el.cfgrok?.value || '',
          montaz: el.cfgmontaz?.value || ''
        }
      };
    }

    return { init, hardReload, getState };
  }

  function stripMultiselect() {
    const selects = document.querySelectorAll('.multiselect-native-select > select');
    selects.forEach(sel => {
      const wrapper = sel.closest('.multiselect-native-select');
      if (!wrapper) return;
      const parent = wrapper.parentElement;
      if (!parent) return;
      sel.style.display = '';
      sel.style.visibility = 'visible';
      sel.style.pointerEvents = 'auto';
      sel.classList.remove('multiselect-hidden', 'hidden');
      parent.insertBefore(sel, wrapper);
      wrapper.remove();
    });
    document.querySelectorAll('.multiselect-wrapper').forEach(w => w.remove());
  }

  function observeMultiselectCleanup() {
    const grid = document.querySelector('.cfg-selectors-grid');
    if (!grid || !('MutationObserver' in window)) return;
    const obs = new MutationObserver(() => stripMultiselect());
    obs.observe(grid, { childList: true, subtree: true });
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
    observeMultiselectCleanup();
    const app = createApp(excelUrl);
    app.init();

    global.KonfiguratorDebug = {
      reload: () => app.hardReload(),
      clear: () => ConfiguratorData.clear(),
      db: () => ConfiguratorData.getDB(),
      state: () => app.getState()
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})(window);


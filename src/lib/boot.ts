// Runs before the first paint (inlined into <head>) so the saved theme and
// panel state apply without a flash. Keep the storage key in sync with prefs.ts.
export const PREFS_BOOT_SCRIPT = `(function(){try{var p=JSON.parse(localStorage.getItem('dryrun.prefs.v1')||'{}');var r=document.documentElement;if(p.theme==='light'||p.theme==='dark')r.setAttribute('data-theme',p.theme);r.setAttribute('data-sidebar',p.sidebar==='closed'?'closed':'open');}catch(e){}})();`;

export const FONT_LINKS = [
  'https://fonts.googleapis.com/css2?family=Lexend:wght@500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,400;0,600;0,700;1,400&display=swap',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
];

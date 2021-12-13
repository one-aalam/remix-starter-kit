import type { SupabaseScript } from './supabase.types';
import { CND_URL, CDN_URL_REGEX, EXISTING_SCRIPT_MESSAGE } from './supabase.constants'

export const findScript = (): HTMLScriptElement | null => {
    const scripts = document.querySelectorAll<HTMLScriptElement>(
      `script[src^="${CND_URL}"]`
    );

    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];

      if (!CDN_URL_REGEX.test(script.src)) {
        continue;
      }

      return script;
    }

    return null;
};

const injectScript = (): HTMLScriptElement => {

    const script = document.createElement('script');
    script.src = `${CND_URL}`;

    const headOrBody = document.head || document.body;

    if (!headOrBody) {
      throw new Error(
        'Expected document.body not to be null. Supabase client requires a <body> element.'
      );
    }

    headOrBody.appendChild(script);
    return script;
};

let supabasePromise: Promise<SupabaseScript | null> | null = null;
export const loadScript = (): Promise<SupabaseScript | null> => {
    if (supabasePromise !== null) {
      return supabasePromise;
    }

    supabasePromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        // Resolve to null when imported server-side. This makes the module safe to import in an universal code base.
        resolve(null);
        return;
      }

      if (window?.supabase) {
        console.warn(EXISTING_SCRIPT_MESSAGE);
      }

      if (window?.supabase) {
        resolve(window.supabase);
        return;
      }

      try {
        let script = findScript();

        if (script) {
          console.warn(EXISTING_SCRIPT_MESSAGE);
        } else if (!script) {
          script = injectScript();
        }

        script.addEventListener('load', () => {
          if (window.supabase) {
            resolve(window.supabase);
          } else {
            reject(new Error('supabase not available'));
          }
        });

        script.addEventListener('error', () => {
          reject(new Error('Failed to load supabase.js'));
        });
      } catch (error) {
            reject(error);
            return;
      }
    });

    return supabasePromise;
  };

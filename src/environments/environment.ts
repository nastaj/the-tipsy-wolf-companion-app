// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Supabase project settings (Project Settings → API). The publishable/anon key
  // is safe to ship in the client; never put the service_role key here.
  // See docs/supabase-setup.md.
  supabase: {
    url: 'https://pyjhxbbahgtrlfusjnre.supabase.co',
    anonKey: 'sb_publishable_2EZo8Kc63vdSYvg7yHatWw_0l8_ec8A',
  },
};

// VV Parameter Generator
// Extracted from iyf.tv application's API request interceptor

import { Console } from "console";

interface VVParams {
  [key: string]: any;
}

interface GenerateVVOptions {
  url?: string;
  pub?: string | number;
}

// Simple query string stringify function
function stringify(params: VVParams): string {
  return Object.keys(params)
    .sort()
    .map(key => `${key}=${encodeURIComponent(String(params[key]))}`)
    .join('&');
}

export function generateVV(params: VVParams, options: GenerateVVOptions = {}): string {
  const url = options.url;
  const pub = options.pub !== undefined ? String(options.pub) : undefined;

  // Parameters sorted alphabetically (excluding certain keys)
  const EXCLUDED_KEYS = ["pub", "vv", "uid", "gid", "expire", "sign", "login_uid", "DeviceId", "token", "System", "SystemVersion", "Version", "AppVersion", "version", "cacheable", "Lang", "i18n"];

  // Get the query string part of URL
  let h = "";
  if (url && url.includes("?")) {
    const parts = url.split("?");
    if (parts.length > 1) {
      h = parts[1].toLowerCase();
    }
  }

  // Stringify params, skip nulls, convert to lowercase
  const sortedParams: VVParams = {};
  if (params) {
    const keys = Object.keys(params);
    keys.sort();

    for (const key of keys) {
      // Skip certain parameters
      if (!EXCLUDED_KEYS.includes(key) && params[key] != null) {
        sortedParams[key] = params[key];
      }
    }
  }

  const m = stringify(sortedParams).toLowerCase();
  console.log(m);
  console.log(h);
  // Combine values: [pub, url_query_string, sorted_params_string, secret_key]
  const v = [pub, h, m, "5569958*1"];

  // Filter out empty values
  const filtered = v.filter(item => !!item);

  // Join with "&" and decode
  const joined = decodeURIComponent(filtered.join("&"));

  // Return: this should match to vv parameter
  return joined;
}

export function generatePub(): string {
  return Math.floor(Date.now() / 1000).toString();
}

export function generatePubNumber(): number {
  return Math.floor(Date.now() / 1000);
}

export interface VVResult {
  pub: string | number;
  vv: string;
}

export function generateVVWithResult(params: VVParams, options: GenerateVVOptions = {}): VVResult {
  const url = options.url;
  const pubValue = options.pub !== undefined ? String(options.pub) : undefined;
  const vvValue = generateVV(params, { url, pub: options.pub });

  return {
    pub: pubValue !== undefined ? pubValue : '',
    vv: vvValue
  };
}

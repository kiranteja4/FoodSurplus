import dns from 'node:dns';

const DEVELOPMENT_PUBLIC_DNS_SERVERS = ['8.8.8.8', '8.8.4.4'];

export function isDnsOverrideConfigurationAllowed({ NODE_ENV, DEV_USE_PUBLIC_DNS }) {
  return !DEV_USE_PUBLIC_DNS || NODE_ENV === 'development';
}

export function configureDevelopmentDns(env, dnsApi = dns) {
  if (!env.DEV_USE_PUBLIC_DNS || env.NODE_ENV !== 'development') return false;

  dnsApi.setServers(DEVELOPMENT_PUBLIC_DNS_SERVERS);
  return true;
}

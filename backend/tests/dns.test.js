import {
  configureDevelopmentDns,
  isDnsOverrideConfigurationAllowed,
} from '../src/config/dns.js';

describe('development DNS override', () => {
  it('applies the public resolver only when explicitly enabled in development', () => {
    const calls = [];
    const dnsApi = { setServers: (servers) => calls.push(servers) };

    const applied = configureDevelopmentDns(
      { NODE_ENV: 'development', DEV_USE_PUBLIC_DNS: true },
      dnsApi,
    );

    expect(applied).toBe(true);
    expect(calls).toEqual([['8.8.8.8', '8.8.4.4']]);
  });

  it.each(['test', 'production'])('rejects enabling the override in %s', (NODE_ENV) => {
    const calls = [];
    const dnsApi = { setServers: (servers) => calls.push(servers) };
    const config = { NODE_ENV, DEV_USE_PUBLIC_DNS: true };

    expect(isDnsOverrideConfigurationAllowed(config)).toBe(false);
    expect(configureDevelopmentDns(config, dnsApi)).toBe(false);
    expect(calls).toHaveLength(0);
  });

  it('leaves the default development resolver unchanged when disabled', () => {
    const calls = [];
    const dnsApi = { setServers: (servers) => calls.push(servers) };

    expect(
      configureDevelopmentDns(
        { NODE_ENV: 'development', DEV_USE_PUBLIC_DNS: false },
        dnsApi,
      ),
    ).toBe(false);
    expect(calls).toHaveLength(0);
  });
});

type TrustProxySetting = boolean | number | string;

const DEFAULT_TRUST_PROXY = 'loopback, linklocal, uniquelocal';

export function getTrustProxySetting(): TrustProxySetting {
  const configuredValue = process.env.TRUST_PROXY?.trim();

  if (!configuredValue) {
    return DEFAULT_TRUST_PROXY;
  }

  if (configuredValue === 'true') {
    return true;
  }

  if (configuredValue === 'false') {
    return false;
  }

  const numericValue = Number(configuredValue);

  if (!Number.isNaN(numericValue)) {
    return numericValue;
  }

  return configuredValue;
}

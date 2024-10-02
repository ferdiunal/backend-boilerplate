export type CountryType = {
  name: Name;
  flag: string;
  cca2: string;
};

export type CountryName = {
  common: string;
  official: string;
  nativeName: NativeName;
};

export type CountryNativeName = Record<
  string,
  {
    official: string;
    common: string;
  }
>;

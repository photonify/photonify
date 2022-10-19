export type Sizes = {
  xl?: {
    width: number;
    height: number;
  };
  lg?: {
    width: number;
    height: number;
  };
  md?: {
    width: number;
    height: number;
  };
  sm?: {
    width: number;
    height: number;
  };
};

export type Settings = {
  outputDest?: string;
  storage?: "local" | "s3";
  outputFormat?: SupportedFileTypes;
  sizes?: Sizes;
};

export type Files = Buffer | Buffer[];

export type SupportedFileTypes = "jpg" | "png" | "tiff";

export type Settings = {
  fileName: string;
  sizes?: string[];
  fingerprint?: boolean;
};

export type Files = Blob | Blob[];

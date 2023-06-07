// ----------------------------------------------------------------------

export type IFileContributor = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  permission: string;
};

export type IFolderManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  tags: string[];
  totalFiles?: number;
  isFavorited: boolean;
  contributors: IFileContributor[] | null;
  dateCreated: Date | number | string;
  dateModified: Date | number | string;
};

export type IFileManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  tags: string[];
  isFavorited: boolean;
  contributors: IFileContributor[] | null;
  dateCreated: Date | number | string;
  dateModified: Date | number | string;
};

export interface IUploadFile {
  name: string;
  size: number;
  type: string;
  dateCreated: Date | number;
  dateModified: Date | number;
	buffer: Buffer | File
}

export type IFile = IFileManager

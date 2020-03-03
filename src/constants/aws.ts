import { FileMap } from "../types";

// regions that are enabled by default
const regionCodes = {
  "us-east-1": "US East (N. Virginia)",
  "us-east-2": "US East (Ohio)",
  "us-west-1": "US West (N. California)",
  "us-west-2": "US West (Oregon)",
  // 'ap-east-1': 'Asia Pacific (Hong Kong)', - requires user opt-in
  "ap-south-1": "Asian Pacific (Mumbai)",
  "ap-northeast-1": "Asia Pacific (Tokyo)",
  // 'ap-northeast-2': 'Asia Pacific (Seoul)', - limited support
  "ap-southeast-1": "Asia Pacific (Singapore)",
  "ap-southeast-2": "Asia Pacific (Sydney)",
  "eu-central-1": "EU (Frankfurt)",
  // 'eu-north-1': 'EU (Stockholm)', - has restricted instance types
  "eu-west-1": "EU (Ireland)",
  "eu-west-2": "EU (London)",
  "eu-west-3": "EU (Paris)",
  // 'me-south-1': 'Middle East (Bahrain)', - requires user opt-in
  "sa-east-1": "South America (São Paulo)"
};

export const AWS_REGIONS = Object.keys(regionCodes);

export const EC2_STR = "EC2 with Elastic IP";
export const RDS_STR = "RDS with Provisioned IOPs";
export const EC2_FILENAME = "ec2template.json";
export const RDS_FILENAME = "rdstemplate.json";
export const STACKNAMES = [EC2_STR, RDS_STR];
export const FILEMAP: FileMap = {
  "EC2 with Elastic IP": EC2_FILENAME,
  "RDS with Provisioned IOPs": RDS_FILENAME
};
export const RDS_MAX_STORAGE = 65536;
export const RDS_MIN_STORAGE = 100;

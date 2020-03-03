export type CloudFormationTemplate = {
  AWSTemplateFormatVersion: string
  Description: string
  Parameters: Parameters
  Mappings: Mappings
  Resources: Resources
  Outputs: Outputs
}

type Parameters = {
  InstanceType: InstanceType
  KeyName: KeyName
  SSHLocation: SSHLocation
  DBUser: DBUser
  DBPassword: DBPassword
  DBAllocatedStorage: DBAllocatedStorage
}

type InstanceType = {
  Description: string
  Type: string
  Default: string
  AllowedValues: string[]
  ConstraintDescription: string
}

type KeyName = {
  Description: string
  Type: string
  ConstraintDescription: string
}

type SSHLocation = {
  Description: string
  Type: string
  MinLength: string
  MaxLength: string
  Default: string
  AllowedPattern: string
  ConstraintDescription: string
}

type DBUser = {
  NoEcho: string
  Description: string
  Type: string
  MinLength: string
  MaxLength: string
  AllowedPattern: string
  ConstraintDescription: string
}

type DBPassword = {
  NoEcho: string
  Description: string
  Type: string
  MinLength: string
  MaxLength: string
  AllowedPattern: string
  ConstraintDescription: string
}

type DBAllocatedStorage = {
  Description: string
  Type: string
  Default: number
  MinValue: string
  MaxValue: string
  ConstraintDescription: string
}

type Mappings = {
  AWSInstanceType2Arch: object
  AWSInstanceType2NATArch: object
  AWSRegionArch2AMI: object
}

type Resources = {
  EC2Instance: {
    Type: string
    Properties: object
  }
  InstanceSecurityGroup: {
    Type: string
    Properties: object
  }
  IPAddress: {
    Type: string
  }
  IPAssoc: {
    Type: string
    Properties: object
  }
}

type Outputs = {
  InstanceId: {
    Description: string
    Value: object
  }
  InstanceIPAddress: {
    Description: string
    Value: object
  }
}

export type KeyPairs = {
  KeyPairs: KeyPair[]
}

export type KeyPair = {
  Tags: any[]
  KeyName: string
  KeyFingerprint: string
  KeyPairId: string
}

export type StackSummaries = {
  StackSummaries: StackSummary[]
}

type StackSummary = {
  StackId: string
  DeletionTime: string
  TemplateDescription: string
  CreationTime: string
  StackName: string
  StackStatus: string
  DriftInformation: {
    StackDriftStatus: string
  }
}

export type StackResources = {
  StackResources: StackResource[]
}

type StackResource = {
  StackId: string
  ResourceStatus: string
  DriftInformation: {
    StackResourceDriftStatus: string
  }
  ResourceType: string
  Timestamp: string
  StackName: string
  PhysicalResourceId: string
  LogicalResourceId: string
}

export type DBInstances = {
  DBInstances: RDSInstance[]
}

type RDSInstance = {
  Endpoint: {
    Address: string
    Port: string
    HostedZoneId: string
  }
}

export type EC2Reservation = {
  Reservations: Reservation[]
}

type Reservation = {
  Instances: Instance[]
  ReservationId: string
  RequesterId: string
  Groups: any[]
  OwnerId: string
}

type Instance = {
  Monitoring: {
    State: string
  }
  PublicDnsName: string
  State: {
    Code: number
    Name: string
  }
  EbsOptimized: boolean
  LaunchTime: string
  PublicIpAddress: string
  PrivateIpAddress: string
  ProductCodes: any[]
  VpcId: string
  CpuOptions: {
    CoreCount: number
    ThreadsPerCore: number
  }
  StateTransitionReason: string
  InstanceId: string
  EnaSupport: boolean
  ImageId: string
  PrivateDnsName: string
  KeyName: string
  SecurityGroups: SecurityGroup[]
  ClientToken: string
  SubnetId: string
  InstanceType: string
  CapacityReservationSpecification: {
    CapacityReservationPreference: string
  }
  NetworkInterfaces: any[]
  SourceDestCheck: boolean
  Placement: {
    Tenancy: string
    GroupName: string
    Availability: string
  }
  Hypervisor: string
  BlockDeviceMappings: any[]
  Architecture: string
  RootDeviceType: string
  RootDeviceName: string
  VirtualizationType: string
  Tags: Tag[]
  HibernationOptions: {
    Configured: boolean
  }
  MetadataOptions: {
    State: string
    HttpEndpoint: string
    HttpTokens: string
    HttpPutResponseHopLimit: number
  }
  AmiLaunchIndex: number
}

type SecurityGroup = {
  GroupName: string
  GroupId: string
}

type Tag = {
  Value: string
  Key: string
}

export type DatabaseParameters = {
  dbUser: string
  dbPassword: string
  dbSizeInt: number
}

export type EC2Params = {
  chosenKeyPair: string
  instanceType: string
}

export type StackParameters = {
  dbUser?: string
  dbPassword?: string
  dbSizeInt?: number
  chosenKeyPair?: string
  instanceType?: string
}

import { ux } from '@cto.ai/sdk'
import sinon from 'sinon'
import chai from 'chai'
import { runRDSPrompts } from '../prompts/rds'
import * as ec2 from '../prompts/ec2'

const sandbox = sinon.createSandbox()
const { callOutCyan } = ux.colors
const keyPairs = [
  {
    Tags: ['foo'],
    KeyName: 'test',
    KeyFingerprint: 'test',
    KeyPairId: 'test',
  },
]

const instanceTypes = {
  AWSTemplateFormatVersion: 'test',
  Description: 'test',
  Parameters: {
    InstanceType: {
      Description: 'test',
      Type: 'test',
      Default: '1',
      AllowedValues: ['1', '2', '3'],
      ConstraintDescription: 'test',
    },
    KeyName: {
      Description: 'test',
      Type: 'test',
      ConstraintDescription: 'test',
    },
    SSHLocation: {
      Description: 'test',
      Type: 'test',
      MinLength: 'test',
      MaxLength: 'test',
      Default: 'test',
      AllowedPattern: 'test',
      ConstraintDescription: 'test',
    },
    DBUser: {
      NoEcho: 'test',
      Description: 'test',
      Type: 'test',
      MinLength: 'test',
      MaxLength: 'test',
      AllowedPattern: 'test',
      ConstraintDescription: 'test',
    },
    DBPassword: {
      NoEcho: 'test',
      Description: 'test',
      Type: 'test',
      MinLength: 'test',
      MaxLength: 'test',
      AllowedPattern: 'test',
      ConstraintDescription: 'test',
    },
    DBAllocatedStorage: {
      Description: 'test',
      Type: 'test',
      Default: 1,
      MinValue: 'test',
      MaxValue: 'test',
      ConstraintDescription: 'test',
    },
  },

  Mappings: {
    AWSInstanceType2Arch: {},
    AWSInstanceType2NATArch: {},
    AWSRegionArch2AMI: {},
  },

  Resources: {
    EC2Instance: {
      Type: 'test',
      Properties: {},
    },
    InstanceSecurityGroup: {
      Type: 'test',
      Properties: {},
    },
    IPAddress: {
      Type: 'test',
    },
    IPAssoc: {
      Type: 'test',
      Properties: {},
    },
  },
  Outputs: {
    InstanceId: {
      Description: 'test',
      Value: {},
    },
    InstanceIPAddress: {
      Description: 'test',
      Value: {},
    },
  },
}

describe('Test parameter prompt functions', () => {
  before(() => {
    sandbox.stub(ec2, 'getEC2KeyPairs').returns(Promise.resolve(keyPairs))
    sandbox.stub(ec2, 'getEC2InstanceType').returns(Promise.resolve('1'))
    sandbox.stub(ux, 'print')
    sandbox
      .stub(ux, 'prompt')
      .withArgs({
        type: 'input',
        name: 'dbUser',
        message: `Please enter a username for the database admin account\n${callOutCyan(
          'Maxiumum 16 alphanumeric charaters'
        )}`,
      })
      .returns(
        Promise.resolve({
          dbUser: 'foo',
        })
      )
      .withArgs({
        type: 'input',
        name: 'dbPassword',
        message: `Please enter a password for the database admin account\n${callOutCyan(
          'From 6 - 41 alphanumeric charaters'
        )}`,
      })
      .returns(
        Promise.resolve({
          dbPassword: 'bar',
        })
      )
      .withArgs({
        type: 'input',
        name: 'dbSize',
        message: 'Please enter the size of the database (GiB)',
      })
      .returns(
        Promise.resolve({
          dbSize: '100',
        })
      )
      .withArgs({
        type: 'autocomplete',
        name: 'chosenKeyPair',
        message: 'Please choose the EC2 keypair you would like to use',
        choices: [
          ...keyPairs.map(keyPair => keyPair.KeyName),
          'Create a new key pair',
        ],
      })
      .returns(
        Promise.resolve({
          chosenKeyPair: 'test',
        })
      )
  })
  after(() => {
    sandbox.restore()
  })
  afterEach(() => {
    sandbox.resetHistory()
  })

  it('runRDSPrompts should return object with valid properties', async () => {
    const rdsParams = await runRDSPrompts()
    chai.expect(rdsParams).to.have.property('dbUser')
    chai.expect(rdsParams).to.have.property('dbPassword')
    chai.expect(rdsParams).to.have.property('dbSizeInt')
    chai.expect(rdsParams.dbUser).to.be.deep.equal('foo')
    chai.expect(rdsParams.dbPassword).to.be.deep.equal('bar')
    chai.expect(rdsParams.dbSizeInt).to.be.deep.equal(100)
  })
  it('ec2KeyPairPrompt returns valid keypair name', async () => {
    const chosenKeyPair = await ec2.ec2KeyPairPrompt('blah')
    chai.expect(chosenKeyPair).to.be.deep.equal('test')
  })
  it('runEC2Prompts should return object with valid properties', async () => {
    const ec2Params = await ec2.runEC2Prompts(instanceTypes, 'blah')
    chai.expect(ec2Params).to.have.property('chosenKeyPair')
    chai.expect(ec2Params).to.have.property('instanceType')
    chai.expect(ec2Params.chosenKeyPair).to.be.deep.equal('test')
    chai.expect(ec2Params.instanceType).to.be.deep.equal('1')
  })
})

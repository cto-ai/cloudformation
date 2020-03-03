![CTO Banner](https://raw.githubusercontent.com/cto-ai/aws/master/assets/banner.png)

# CloudFormation Op

This Op enables you to provision infrastructure through AWS CloudFormation.

## Features

There are two CloudFormation templates bundled into this Op allowing you to:

- Create/Delete an AWS EC2 instance
- Create/Delete an AWS RDS instance running MySQL as its engine

NOTE: The Op only supports EC2 and RDS with limited parameter inputs, if you would like to expand the functionality pull requests are always welcome!

## Setup & Requirements

To run this or any other Op, install the [Ops Platform](https://cto.ai/platform).

Find information about how to run and build Ops via the [Ops Platform Documentation](https://cto.ai/docs/overview)

You will also require an active AWS account with these credentials ready:

- AWS Access Key ID
- AWS Secret Access Key

For information on getting these keys see the [Official AWS Docs](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys).

For ease of use it is recommended that you set both of these keys in your teams secrets store by running:

```text
ops secret:set
```

If you use `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` as the secret names the Op will automatically use it without you needing to select it!

## Usage

From your terminal:

```bash
ops run cloudformation
```

From Slack:

```text
/ops run cloudformation
```

## Known Limitations

- Not all AWS service regions supported.
- Certain combinations of AWS regions and selected parameters for the EC2/RDS instance are not valid and will not work
- The provisioning of the CloudFormation stacks requires users have adequate privileges

## Testing

Run `npm test`

## Debugging Issues

When submitting issues or requesting help, be sure to also include the version information. To get your ops version run:

```bash
ops -v
```

## Contributing

See the [Contributing Docs](CONTRIBUTING.md) for more information

## Contributors

<table>
  <tr>
    <td align="center"><a href="https://github.com/minsohng"><img src="https://avatars3.githubusercontent.com/u/19717602?v=4" width="100px;" alt=""/><br /><sub><b>Min Sohng</b></sub></a><br/></td>
    <td align="center"><a href="https://github.com/tw5033"><img src="https://avatars2.githubusercontent.com/u/16050851?&v=4" width="100px;" alt=""/><br /><sub><b>Timothy Wan</b></sub></a><br/></td>
    <td align="center"><a href="https://github.com/CalHoll"><img src="https://avatars3.githubusercontent.com/u/21090765?s=400&v=4" width="100px;" alt=""/><br /><sub><b>Calvin Holloway</b></sub></a><br/></td>
  </tr>
</table>

## License

[MIT](LICENSE.txt)

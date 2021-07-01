version = 0.1
[default]
[default.deploy]
[default.deploy.parameters]
stack_name = "Bestellapp"
s3_bucket = "aws-sam-cli-managed-default-samclisourcebucket-18fwvr3gizm8a"
s3_prefix = "Bestellapp"
region = "eu-central-1"
confirm_changeset = true
capabilities = "CAPABILITY_IAM"
parameter_overrides = "AppName=\"Bestellapp\" ClientDomains=\"http://localhost:8080\" AdminEmail=\"sinon.schwegler@live.de\" AddGroupsToScopes=\"true\""

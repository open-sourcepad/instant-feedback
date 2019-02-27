require 'net/ssh/proxy/command'
require 'sshkit'
require 'sshkit/dsl'
include SSHKit::DSL


SSHKit.config.output_verbosity = :debug

####
####
# Modify the following constants
BASTION_SSH = 'ec2-user@13.228.206.186'
APP_SSH = 'deploy@10.0.2.68'
APP_PATH = '/home/deploy/production/current'
####
####

SSHKit::Backend::Netssh.configure do |ssh|
  ssh.ssh_options = {
    proxy: Net::SSH::Proxy::Command.new("ssh -W %h:%p #{BASTION_SSH}")
  }
end

run_locally do
  execute 'ng build --prod'
  execute 'env GZIP=-9 tar -zcvf dist.tar.gz dist'
end

on APP_SSH do
  # as "deploy" do
    execute "mkdir -p #{APP_PATH}/dist"
    upload! 'dist.tar.gz', APP_PATH
    execute "rm -r #{APP_PATH}/dist && cd #{APP_PATH} && tar xvf dist.tar.gz"
  # end
end

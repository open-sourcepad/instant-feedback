[ "`git log --pretty=%H ...refs/heads/master^ | head -n 1`" = "`git ls-remote origin -h refs/heads/master |cut -f1`" ] &&
eval ruby deploy/staging.rb  || echo "Make sure your are in sync with master"

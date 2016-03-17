#!/usr/bin/env ruby
require 'octokit'

if ENV['TRAVIS_BRANCH'] == 'master'
  puts "NOTE: Main or Pull request merge branch, stopping."
  exit
end

# Create client
client = Octokit::Client.new(:access_token => ENV['GITHUB_STATUS_TOKEN'])

# Grab environment vars
repo_name = ENV['TRAVIS_REPO_SLUG']
sha = ENV['TRAVIS_COMMIT']

# Set status
status = client.create_status(repo_name, sha, "pending", {:context => 'Mumbot-test', :description => 'Waiting for successful Mumbot-test deployment'})
puts "NOTE: Added Github commit status."


# frozen_string_literal: true

require 'rubygems'
require 'excon'

class TwitterController < ApplicationController
  def scrape
    # Twitter's free API is severely restricted, so we're using a scraper here
    # as a hack for demonstration purposes only.
    query = params[:query].unpack('m')
    limit = params[:limit]
    result = `scrape-twitter search --query=#{query} --count=#{limit}`
    render json: result, status: :ok
  end

  def user
    # Twitter's free API is severely restricted, so we're using a scraper here
    # as a hack for demonstration purposes only.
    name = params[:name]
    result = `scrape-twitter profile #{name}`
    render json: result, status: :ok
  end
end

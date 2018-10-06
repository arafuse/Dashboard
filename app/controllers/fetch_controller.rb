# frozen_string_literal: true

require 'net/http'
require 'rubygems'
require 'excon'

USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
REFERER = 'google.com'

class FetchController < ApplicationController
  def get
    # Fetch using net/http (TLS v1.3 is not supported)
    def fetch(uri_str, limit = 10)
      raise ArgumentError, 'Too many HTTP redirects' if limit == 0

      uri = URI uri_str
      request = Net::HTTP::Get.new uri
      request['User-Agent'] = USER_AGENT
      request['Referer'] = REFERER
      request['Accept'] = '*/*'
      http = Net::HTTP.new uri.hostname
      http.use_ssl = true if uri.scheme == 'https'
      response = http.start do |http|
        http.request request
      end
      case response
      when Net::HTTPRedirection then
        location = response['location']
        warn "Redirected to #{location}"
        fetch location, limit - 1
      else
        response
      end
    end

    # Fetch using 'excon' gem (TLS v1.3 actually works)
    def fetch_excon(uri_str)
      Excon.get uri_str, headers: {
        'User-Agent' => USER_AGENT,
        'Referer' => REFERER,
        'Accept' => '*/*'
      }
    end

    response = fetch_excon params[:uri].unpack1('M').unpack1('m')
    render json: response.body, status: response.status
  end
end

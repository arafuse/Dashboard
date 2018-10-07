# frozen_string_literal: true

require 'rubygems'
require 'excon'

class TwitchController < ApplicationController
  def sign
    uri_str = params[:uri].unpack1('M').unpack1('m')
    response = Excon.get uri_str + SECRETS["twitch_client_id"]
    render json: response.body, status: response.status
  end
end

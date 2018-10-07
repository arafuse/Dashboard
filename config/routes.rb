# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'pages#root'
  get 'fetch/:uri', to: 'fetch#get'
  get 'twitch/sign/:uri', to: 'twitch#sign'
  get 'twitter/scrape/:query/:limit', to: 'twitter#scrape'
  get 'twitter/user/:name', to: 'twitter#user'
end

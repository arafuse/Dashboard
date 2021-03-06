FROM ruby:2.5.1
RUN apt-get update -qq

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get install -y nodejs
RUN apt-get update && apt-get install -y yarn

COPY . /app/
WORKDIR /app/

RUN bundle install --deployment --without="development test"

ENV NODE_ENV=production \
    RACK_ENV=production \
    RAILS_ENV=production \
    RAILS_SERVE_STATIC_FILES=true

RUN bundle exec rails assets:precompile
CMD bundle exec rails server -p 8080
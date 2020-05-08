############################
# Build container
############################
FROM registry.cto.ai/official_images/node:latest AS dep
WORKDIR /ops

ADD package.json .
RUN npm install
ADD . .
RUN rm -rf lib && npm run build

############################
# Final container
############################
FROM registry.cto.ai/official_images/node:latest

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  tar \
  python \
  openssh-client \
  apache2-utils \
  util-linux \
  bash \
  ca-certificates \
  python-pip \
  python-dev \
  libffi-dev \
  libssl-dev \
  python-setuptools \
  python-wheel \
  && pip install --upgrade \
  awscli \
  boto \
  boto3 \
  botocore \
  && apt-get remove -y \
  python-pip \
  python-dev \
  libffi-dev \
  libssl-dev \
  && apt-get autoremove -y \
  && apt-get clean -y \
  && rm -rf /var/lib/apt/lists

COPY package.json .
WORKDIR /ops
COPY --from=dep --chown=9999:9999 /ops/lib .
COPY --from=dep --chown=9999:9999 /ops .

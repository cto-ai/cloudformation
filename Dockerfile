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

COPY package.json .
RUN apt update \
  && apt install -y --no-install-recommends \
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
  && pip install --upgrade \
  awscli \
  boto \
  boto3 \
  botocore \
  && apt remove -y \
  python-pip \
  python-dev \
  libffi-dev \
  libssl-dev \
  && apt autoremove -y \
  && apt autoclean -y

WORKDIR /ops
COPY --from=dep /ops/lib .
COPY --from=dep /ops .

RUN chown -R 9999 /ops && chgrp -R 9999 /ops
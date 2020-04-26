#!/usr/bin/env bash

PRI=./test-private.pem
PUB=./test-public.pem

if [ -f $PRI ]; then
  rm -f $PRI
fi

openssl genrsa -out $PRI 2048

if [ -f $PUB ]; then
  rm -f $PUB
fi

openssl rsa -in $PRI -pubout -out $PUB

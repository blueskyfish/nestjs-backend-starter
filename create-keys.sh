#!/usr/bin/env bash
#
# Create the RSA keys with openssl.
#
# This is required before execute the backend on the develop machine or running test cases
#

# The filename of the public and private keys

PRI_FILENAME=./test-private.pem
PUB_FILENAME=./test-public.pem

# check, whether a former file of the private key exist and if it exists, then will be deleted it
if [ -f $PRI_FILENAME ]; then
  rm -f $PRI_FILENAME
fi

# generates the private key with 2048 bits
openssl genrsa -out $PRI_FILENAME 2048

# check, whether a former file of the public key exist and if it exists, then will be deleted it
if [ -f $PUB_FILENAME ]; then
  rm -f $PUB_FILENAME
fi

# generates the public key
openssl rsa -in $PRI_FILENAME -pubout -out $PUB_FILENAME

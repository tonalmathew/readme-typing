# name: Node.js CI

# on:
#   push:
#     branches: [ "main" ]
#   pull_request:
#     branches: [ "main" ]

# jobs:
#   build:
#     name: Generate build

#     runs-on: ubuntu-latest

#     steps:
#       - uses: actions/checkout@v3
#       - name: Use Node 16
#         uses: actions/setup-node@v3
#         with:
#           node-version: 16
#       - run: npm ci
#       - run: npm run build
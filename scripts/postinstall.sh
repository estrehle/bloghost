SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
echo $SCRIPT_DIR

cd ${SCRIPT_DIR}/service/ArticleService/application/layers/aws-sdk-v3/nodejs
npm install

cd ${SCRIPT_DIR}/service/ArticleService/application/methods
npm install

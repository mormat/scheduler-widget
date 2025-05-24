# curl -b cookies.txt -d '{ "groups": [ { "id": null, "label": "123" } ] }' -H "Content-Type: application/json" -X POST http://localhost:9001/wordpress?rest_route=/api/v1/groups&namespace=persons > /dev/null

curl -b cookies.txt "http://localhost:9001/wordpress?rest_route=/api/v1/groups&namespace=persons"

cat cookies.txt
echo "done"

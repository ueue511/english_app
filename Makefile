english_app:
	chmod +x ./get-local-ip-addr.sh
	./get-local-ip-addr.sh
	docker-compose up -d
	docker-compose exec english_app bash --login

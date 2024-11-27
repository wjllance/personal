FROM mysql:8.0

# Copy the schema file
COPY ../schema.sql /docker-entrypoint-initdb.d/

# Set default authentication plugin
CMD ["mysqld", "--default-authentication-plugin=mysql_native_password"]

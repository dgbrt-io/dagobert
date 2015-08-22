FROM ubuntu:latest

RUN apt-get update; apt-get install -y curl

# Add crontab file in the cron directory
ADD crontabs/pollmarkets /etc/cron.d/pollmarkets

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/pollmarkets

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Run the command on container startup
CMD echo $SECRET > /secret && cron && tail -f /var/log/cron.log

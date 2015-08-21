FROM python:2.7

ENV PYTHONUNBUFFERED 1

RUN apt-get update; apt-get -y install cron

ADD cronjobs/pollmarkets /etc/cron.hourly/pollmarkets

RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/

CMD ["bash", "docker/bootstrap"]

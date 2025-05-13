from pydantic import BaseModel
import json


class Config(BaseModel):
    DB_PATH: str
    PORT: int
    ENV: str


def get_config():
    with open("env.json") as json_env_file:
        env_config = json.load(json_env_file)
    config_data = Config(**env_config)
    return config_data


config: Config = get_config()

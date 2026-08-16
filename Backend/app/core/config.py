
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    SECRET_KEY: str
    ALLOWED_ORIGINS: list[str]
    ALGORITHM: str

    DB_HOST: str
    DB_USER: str
    DB_NAME: str
    DB_PASSWORD: str
    DB_SSL: bool = False
    DB_SSL_CA: str | None = None
    DB_SSL_CERT: str | None = None
    DB_SSL_KEY: str | None = None

    PORT: int = 8000
    DEBUG: bool = True
    ENVIRONMENT: str

    @property
    def DATABASE_URL(self) -> str:
        username = quote_plus(self.DB_USER)
        password = quote_plus(self.DB_PASSWORD)
        return f"mysql+pymysql://{username}:{password}@{self.DB_HOST}/{self.DB_NAME}"

    @property
    def DB_CONNECT_ARGS(self) -> dict:
        if not self.DB_SSL:
            return {}

        ssl_config = {}
        for key, value in {
            "ca": self.DB_SSL_CA,
            "cert": self.DB_SSL_CERT,
            "key": self.DB_SSL_KEY,
        }.items():
            if value:
                ssl_config[key] = value

        return {"ssl": ssl_config or True}

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = AppSettings()
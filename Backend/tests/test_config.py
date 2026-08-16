from app.core.config import AppSettings


def test_database_url_does_not_force_ssl_when_not_configured(monkeypatch):
    monkeypatch.setenv("SECRET_KEY", "test-secret")
    monkeypatch.setenv("ALLOWED_ORIGINS", '["http://localhost:5173"]')
    monkeypatch.setenv("ALGORITHM", "HS256")
    monkeypatch.setenv("DB_HOST", "localhost")
    monkeypatch.setenv("DB_USER", "root")
    monkeypatch.setenv("DB_NAME", "python_training")
    monkeypatch.setenv("DB_PASSWORD", "secret")
    monkeypatch.setenv("ENVIRONMENT", "test")

    settings = AppSettings()

    assert "ssl=" not in settings.DATABASE_URL
    assert "mysql+pymysql://root:secret@localhost/python_training" in settings.DATABASE_URL

import pytest

class TestCreateTicket:
    def test_create_ticket_with_valid_data_returns_200(self, client, admin_token):
        headers = {"Authorization": f"Bearer {admin_token}"}
        ticket_data = {
            "title":"Login page not working",
            "description": "Users are unable to log in from the mobile app",
            "status": "open",
            "priority": "high"
        }
        response = client.post("/tickets/",json=ticket_data, headers=headers)

        assert response.status_code in (200,201)
        data = response.json()
        assert "id" in data
        assert data["title"] == ticket_data["title"]

class TestGetTicketsList:
    def test_get_tickets_returns_200_and_list(self, client, user_token):
        headers = {"Authorization": f"Bearer {user_token}"}

        response = client.get("/tickets/",headers=headers)
        assert response.status_code == 200

        data = response.json()
        assert isinstance(data,list)

        if len(data)>0:
            assert "id" in data[0]
            assert "title" in data[0]
class TestTicketRBAC:
    def test_regular_user_cannot_delete_ticket_returns_403(self, client, user_token, admin_token):
        headers = {"Authorization": f"Bearer {admin_token}"}
        ticket_data = {
            "title":"Product page not working",
            "description": "Users are unable to use product page the mobile app",
            "status": "open",
            "priority": "high"
        }
        response = client.post('/tickets/',json=ticket_data,headers=headers)
        assert response.status_code in (200,201)

        data = response.json()
        id = data["id"]

        user_headers = {"Authorization": f"Bearer {user_token}"}
        delete_ticket = client.delete(f"/tickets/{id}", headers=user_headers)
        assert delete_ticket.status_code  == 403


        
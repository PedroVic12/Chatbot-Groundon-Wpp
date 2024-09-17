from flask import Flask, render_template, request, jsonify
import mercadopago

class MercadoPagoHandler:
    def __init__(self, access_token):
        self.sdk = mercadopago.SDK(access_token)
        self.paymentSucess = False

    def generate_payment_link(self):
        payment_data = {
            "items": [
                {
                    "id": "1",
                    "title": "Produto 1",
                    "quantity": 1,
                    "currency_id": "BRL",
                    "unit_price": 100.0
                }
            ],
            "back_urls": {
                "success": "http://localhost:5000/compra_certa",
                "failure": "http://localhost:5000/compra_errada",
                "pending": "http://localhost:5000/compra_errada"
            },
            "auto_return": "all",
        }
        result = self.sdk.preference().create(payment_data)
        pay = result["response"]
        print("\n\nResponse:", pay)
        print("\nInit Point:", pay["init_point"])
        print("\nData entrada:", pay["date_created"])

        try:
            if pay["redirect_urls"]:
                print(payment_data["back_urls"])

                if self.paymentSucess:
                    print("Pagamento aprovado!")
            elif pay["id"] != "123456":  # Changed from payment_id to id
                print("Checar id do pagamento!")
            elif pay.get("payment_methods", {}).get("default_payment_method_id") == "credit_card":
                print("Pagamento com cartão de credito!")
        except Exception as e:
            print(f"Erro ao processar o pagamento: {e}")

        return pay["init_point"]

class Routes:
    def __init__(self, app, mercadopago_handler):
        self.app = app
        self.mercadopago_handler = mercadopago_handler
        self.register_routes()

    def register_routes(self):
        self.app.add_url_rule('/', 'index', self.index)
        self.app.add_url_rule('/webhook', 'webhook', self.webhook, methods=['POST'])
        self.app.add_url_rule('/compra_certa', 'compra_certa', self.compra_certa)
        self.app.add_url_rule('/compra_errada', 'compra_errada', self.compra_errada)

    def index(self):
        link_iniciar_pagamento = self.mercadopago_handler.generate_payment_link()
        return render_template('eccomerce_page.html', link_iniciar_pagamento=link_iniciar_pagamento)

    def webhook(self):
        data = request.get_json(silent=True)
        print(data)
        return jsonify(data)

    def compra_certa(self):
        return render_template("compra_certa.html")

    def compra_errada(self):
        return render_template("compra_errada.html")

class App:
    def __init__(self):
        self.app = Flask(__name__)
        self.mercadopago_handler = MercadoPagoHandler("TEST-4398345889891464-091700-8613ae160df3f80b73b46f43616b3237-495427135")
        self.routes = Routes(self.app, self.mercadopago_handler)

    def run(self):
        self.app.run(debug=True)

if __name__ == '__main__':
    app = App()
    app.run()
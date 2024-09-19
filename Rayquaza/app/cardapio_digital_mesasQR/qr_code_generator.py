import qrcode
import os


def generate_qr_code(url, file_name):
    """Gera um QR Code para uma URL específica e salva como imagem."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    # Nome da pasta onde você deseja salvar os arquivos
    folder_name = "../cardapio_digital/qr_code/"
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)

    # Combina o nome da pasta e o nome do arquivo
    file_path = os.path.join(folder_name, file_name)
    img.save(f"../cardapio_digital/qr_code/{file_name}")
    img.save(file_path)
    print('Arquivo salvo em', file_path)


def gerar_url_cardapio(base_url, lojas):
    """Gera QR Codes para uma lista de lojas baseadas em um URL base."""
    for loja in lojas:
        full_url = f"{base_url}/{loja}"
        file_name = f"qrcode_{loja}.png"
        generate_qr_code(full_url, file_name)


if __name__ == "__main__":
    # URL base e lojas
    base_url = 'https://groundon-citta-cardapio.web.app/#/splash'
    lojas = ["Botafogo", "Copacabana", "Ipanema", "Castelo"]
    gerar_url_cardapio(base_url, lojas)

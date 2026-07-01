import os
from PIL import Image

def slice_perfect():
    img_path = 'Perfil/img/Emblemas.png'
    output_dir = 'Perfil/img/emblemas'
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    img = Image.open(img_path)
    width, height = img.size
    print(f"Dimensões da imagem: {width}x{height}")
    
    cols = 5
    rows = 4
    
    cell_w = width / cols
    cell_h = height / rows
    
    # Adicionamos um pequeno recuo (offset) de pixels para remover a borda cinza externa de cada quadrado da imagem
    # Vamos calcular uma margem proporcional a cada célula para tirar as linhas cinzas de fora
    border_offset_x = int(cell_w * 0.05)  # 5% de margem
    border_offset_y = int(cell_h * 0.05)  # 5% de margem
    
    count = 0
    for r in range(rows):
        for c in range(cols):
            if count >= 18:
                break
                
            # Coordenadas da célula
            left = int(c * cell_w) + border_offset_x
            upper = int(r * cell_h) + border_offset_y
            right = int((c + 1) * cell_w) - border_offset_x
            lower = int((r + 1) * cell_h) - border_offset_y
            
            # Recorta a célula sem a borda cinza externa
            cell = img.crop((left, upper, right, lower))
            
            # Salva
            output_path = os.path.join(output_dir, f"emblema_{count + 1}.png")
            cell.save(output_path)
            print(f"Salvo: {output_path} (box: {left}, {upper}, {right}, {lower})")
            count += 1

if __name__ == '__main__':
    slice_perfect()

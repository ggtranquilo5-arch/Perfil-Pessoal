import os
from PIL import Image

def slice_emblems():
    img_path = 'Perfil/img/Emblemas.png'
    output_dir = 'Perfil/img/emblemas'
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    img = Image.open(img_path)
    width, height = img.size
    print(f"Image dimensions: {width}x{height}")
    
    # 5 columns, 4 rows
    cols = 5
    rows = 4
    
    # Calculate cell width and height
    cell_w = width / cols
    cell_h = height / rows
    print(f"Cell size: {cell_w}x{cell_h}")
    
    count = 0
    for r in range(rows):
        for c in range(cols):
            # Only 18 emblems total, so stop after 18
            if count >= 18:
                break
                
            # Crop box coordinates: (left, upper, right, lower)
            left = int(c * cell_w)
            upper = int(r * cell_h)
            right = int((c + 1) * cell_w)
            lower = int((r + 1) * cell_h)
            
            # Crop the cell
            cell = img.crop((left, upper, right, lower))
            
            # Save the cell
            output_path = os.path.join(output_dir, f"emblema_{count + 1}.png")
            cell.save(output_path)
            print(f"Saved: {output_path} (box: {left}, {upper}, {right}, {lower})")
            count += 1

if __name__ == '__main__':
    slice_emblems()

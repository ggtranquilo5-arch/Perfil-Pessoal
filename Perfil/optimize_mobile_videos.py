import os
import subprocess

ffmpeg = r"C:\Python312\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
video_dir = r"c:\xampp\htdocs\Perfil-Pessoal\Perfil\img\Videos"

files = [f for f in os.listdir(video_dir) if f.endswith(".mp4")]

print("Found videos:", files)

for f in files:
    input_path = os.path.join(video_dir, f)
    output_path = os.path.join(video_dir, f"mobile_{f}")
    
    print(f"Compressing {f} for mobile fast-start...")
    cmd = [
        ffmpeg, "-y",
        "-i", input_path,
        "-vf", "scale=-2:'min(720,ih)'",
        "-c:v", "libx264",
        "-crf", "28",
        "-preset", "faster",
        "-r", "30",
        "-g", "30",
        "-pix_fmt", "yuv420p",
        "-an",
        "-movflags", "+faststart",
        output_path
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        in_size = os.path.getsize(input_path) / (1024*1024)
        out_size = os.path.getsize(output_path) / (1024*1024)
        print(f"SUCCESS: {f} ({in_size:.1f}MB -> {out_size:.1f}MB)")
        # Replace original file safely
        os.replace(output_path, input_path)
    else:
        print(f"FAILED {f}:", result.stderr)

print("ALL VIDEOS COMPRESSED AND MOBILE-OPTIMIZED!")

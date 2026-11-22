import os
import sys
import asyncio
import subprocess
import shutil

try:
    import edge_tts
except ImportError:
    edge_tts = None

def get_latest_download_mp3():
    home = os.path.expanduser('~')
    downloads = os.path.join(home, 'Downloads')
    mp3s = [os.path.join(downloads, f) for f in os.listdir(downloads) if f.lower().endswith('.mp3') and not 'demo' in f.lower()]
    if not mp3s:
        return None
    mp3s.sort(key=os.path.getmtime, reverse=True)
    return mp3s[0]

async def ensure_watermark(wm_path):
    if not os.path.exists(wm_path):
        communicate = edge_tts.Communicate('TuSong Producciones. Demo.', 'es-AR-ElenaNeural')
        await communicate.save(wm_path)

def apply_watermark(song_path, output_path=None):
    if not os.path.exists(song_path):
        print(f"Error: {song_path} no existe.")
        return False
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    wm_path = os.path.join(script_dir, 'watermark.mp3')
    
    if not os.path.exists(wm_path):
        asyncio.run(ensure_watermark(wm_path))

    # Probe duration
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', song_path]
    res = subprocess.run(cmd, capture_output=True, text=True)
    import json
    info = json.loads(res.stdout)
    duration = float(info['format']['duration'])

    # Determine watermark times (every 22s: e.g. at 10s, 32s, 54s...)
    times = []
    t = 10
    while t < duration - 8:
        times.append(t)
        t += 22

    if not times:
        times = [max(5, int(duration // 2))]

    # Build ffmpeg command
    cmd = ['ffmpeg', '-y', '-i', song_path]
    for _ in times:
        cmd.extend(['-i', wm_path])

    filter_parts = []
    inputs = ['[0:a]']
    weights = ['0.8']
    for idx, sec in enumerate(times, start=1):
        ms = int(sec * 1000)
        filter_parts.append(f'[{idx}:a]adelay={ms}|{ms},volume=2.6[w{idx}]')
        inputs.append(f'[w{idx}]')
        weights.append('1.4')

    mix_str = ''.join(inputs) + f'amix=inputs={len(inputs)}:duration=first:weights=' + ' '.join(weights) + '[out]'
    filter_complex = ';'.join(filter_parts) + ';' + mix_str

    if not output_path:
        base, ext = os.path.splitext(song_path)
        output_path = f"{base} - DEMO TuSong{ext}"

    cmd.extend([
        '-filter_complex', filter_complex,
        '-map', '[out]',
        '-c:a', 'libmp3lame',
        '-b:a', '192k',
        output_path
    ])

    print(f"Procesando: {os.path.basename(song_path)} -> {os.path.basename(output_path)}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"¡Éxito! Demo guardada en: {output_path}")
        return True
    else:
        print("Error en FFmpeg:", res.stderr)
        return False

if __name__ == '__main__':
    if len(sys.argv) > 1:
        target = sys.argv[1]
    else:
        target = get_latest_download_mp3()
    
    if target:
        apply_watermark(target)
    else:
        print("No se encontró ningún archivo MP3 reciente en Descargas.")

import os
import subprocess
import json

source_folder = "upload"
phone_folder = "/sdcard/Pictures/"


def create_folder(folder_path, folder_name):
    subprocess.run(["adb", "shell", "mkdir", "-p",
                   folder_path + folder_name])
    return folder_path + folder_name
    print("Created folder in " + folder_path + " with name " + folder_name)


def check_folder(folder_path):
    result = subprocess.run(
        ["adb", "shell",
            f"if [ -d '{folder_path}' ]; then echo 'exists'; else echo 'not exists'; fi"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    return result.stdout.strip()


def transferStickers(new_phone_folder_path):
    counter = 0
    for filename in os.listdir(source_folder):
        source_file = os.path.join(source_folder, filename)
        process = subprocess.run(
            ["adb", "push", source_file, new_phone_folder_path])
        print("Transfering " + filename)
        counter += 1
        if (process.returncode == 0):
            os.remove(source_file)
    print("Transferred " + str(counter) +
          " stickers to" + new_phone_folder_path)


def main():
    with open("information.json") as f:
        d = json.load(f)
        group_name = d["group_name"]
        folder_name = group_name.replace(" ", "-") + "-stickers"

    if check_folder(phone_folder + folder_name) == "exists":
        transferStickers(phone_folder + folder_name)
    else:
        new_folder_path = create_folder(phone_folder, folder_name)
        transferStickers(new_folder_path)


if __name__ == "__main__":
    main()

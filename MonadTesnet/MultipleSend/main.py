import os
import random
import asyncio
from web3 import Web3
from eth_account import Account
from colorama import init, Fore, Style

# Inisialisasi colorama
init(autoreset=True)

# Konstanta
NETWORK_URL = "https://testnet-rpc.monad.xyz/"
CHAIN_ID = 10143
EXPLORER_URL = "https://testnet.monadexplorer.com/tx/0x"

# Inisialisasi web3 provider
w3 = Web3(Web3.HTTPProvider(NETWORK_URL))

# Periksa koneksi
if not w3.is_connected():
    raise Exception("Tidak dapat terhubung ke jaringan")

# Fungsi membaca private key dari pvkey.txt
def load_private_keys(file_path):
    try:
        with open(file_path, 'r') as file:
            keys = [line.strip() for line in file.readlines() if len(line.strip()) in [64, 66]]
            if not keys:
                raise ValueError("Tidak ditemukan private key yang valid dalam file")
            return keys
    except FileNotFoundError:
        print(f"{Fore.RED}❌ File pvkey.txt tidak ditemukan{Style.RESET_ALL}")
        return None
    except Exception as e:
        print(f"{Fore.RED}❌ Kesalahan membaca file pvkey.txt: {str(e)}{Style.RESET_ALL}")
        return None

# Fungsi membaca alamat dari address.txt
def load_addresses(file_path):
    try:
        with open(file_path, 'r') as file:
            addresses = [line.strip() for line in file if line.strip()]
            if not addresses:
                raise ValueError("Tidak ditemukan alamat yang valid dalam file")
            return addresses
    except FileNotFoundError:
        print(f"{Fore.RED}❌ File address.txt tidak ditemukan{Style.RESET_ALL}")
        return None
    except Exception as e:
        print(f"{Fore.RED}❌ Kesalahan membaca file address.txt: {str(e)}{Style.RESET_ALL}")
        return None

# Fungsi menampilkan border cantik
def print_border(text, color=Fore.MAGENTA, width=60):
    print(f"{color}╔{'═' * (width - 2)}╗{Style.RESET_ALL}")
    print(f"{color}║ {text:^56} ║{Style.RESET_ALL}")
    print(f"{color}╚{'═' * (width - 2)}╝{Style.RESET_ALL}")

# Fungsi menampilkan langkah
def print_step(step, message, lang):
    steps = {
        'id': {'send': 'Kirim Transaksi'},
        'en': {'send': 'Send Transaction'}
    }
    step_text = steps[lang][step]
    print(f"{Fore.YELLOW}🔸 {Fore.CYAN}{step_text:<15}{Style.RESET_ALL} | {message}")

# Alamat acak dengan checksum
def get_random_address():
    random_address = '0x' + ''.join(random.choices('0123456789abcdef', k=40))
    return w3.to_checksum_address(random_address)

# Fungsi mengirim transaksi
async def send_transaction(private_key, to_address, amount, language):
    account = Account.from_key(private_key)
    sender_address = account.address
    lang = {
        'id': {'send': 'Mengirim transaksi...', 'success': 'Transaksi berhasil!', 'failure': 'Transaksi gagal'},
        'en': {'send': 'Sending transaction...', 'success': 'Transaction successful!', 'failure': 'Transaction failed'}
    }[language]

    try:
        nonce = w3.eth.get_transaction_count(sender_address)
        latest_block = w3.eth.get_block('latest')
        base_fee_per_gas = latest_block['baseFeePerGas']
        max_priority_fee_per_gas = w3.to_wei(0, 'gwei')  # Kurangi biaya prioritas menjadi 1 gwei
        max_fee_per_gas = base_fee_per_gas + max_priority_fee_per_gas

        tx = {
            'nonce': nonce,
            'to': w3.to_checksum_address(to_address),
            'value': w3.to_wei(amount, 'ether'),
            'gas': 21000,
            'maxFeePerGas': max_fee_per_gas,
            'maxPriorityFeePerGas': max_priority_fee_per_gas,
            'chainId': CHAIN_ID,
        }

        print_step('send', lang['send'], language)
        signed_tx = w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        tx_link = f"{EXPLORER_URL}{tx_hash.hex()}"
        
        await asyncio.sleep(2)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=180)
        
        if receipt.status == 1:
            print_step('send', f"{Fore.GREEN}✔ {lang['success']} Tx: {tx_link}{Style.RESET_ALL}", language)
            print(f"{Fore.YELLOW}Pengirim / Sender: {sender_address}{Style.RESET_ALL}")
            print(f"{Fore.YELLOW}Penerima / Receiver: {to_address}{Style.RESET_ALL}")
            print(f"{Fore.YELLOW}Jumlah / Amount: {amount:.6f} MONAD{Style.RESET_ALL}")
            print(f"{Fore.YELLOW}Gas: {receipt['gasUsed']}{Style.RESET_ALL}")
            print(f"{Fore.YELLOW}Blok / Block: {receipt['blockNumber']}{Style.RESET_ALL}")
            balance = w3.from_wei(w3.eth.get_balance(sender_address), 'ether')
            print(f"{Fore.YELLOW}Saldo / Balance: {balance:.6f} MONAD{Style.RESET_ALL}")
            return True
        else:
            print_step('send', f"{Fore.RED}✘ {lang['failure']} Tx: {tx_link}{Style.RESET_ALL}", language)
            return False
    except Exception as e:
        print_step('send', f"{Fore.RED}✘ Gagal: {str(e)}{Style.RESET_ALL}", language)
        return False

# Fungsi mengirim ke alamat acak
async def send_to_random_addresses(amount, tx_count, private_keys, language):
    lang = {
        'id': {'start': f'Memulai {tx_count} transaksi acak'},
        'en': {'start': f'Starting {tx_count} random transactions'}
    }[language]
    print_border(lang['start'], Fore.CYAN)
    
    count = 0
    for _ in range(tx_count):
        for private_key in private_keys:
            to_address = get_random_address()
            if await send_transaction(private_key, to_address, amount, language):
                count += 1
            await asyncio.sleep(random.uniform(0.1, 0.5))  # Delay acak 1-3 detik
    
    print(f"{Fore.YELLOW}Total transaksi berhasil: {count}{Style.RESET_ALL}")
    return count

# Fungsi mengirim ke alamat dari file
async def send_to_file_addresses(amount, addresses, private_keys, language):
    lang = {
        'id': {'start': f'Memulai transaksi ke {len(addresses)} alamat dari file'},
        'en': {'start': f'Starting transactions to {len(addresses)} addresses from file'}
    }[language]
    print_border(lang['start'], Fore.CYAN)
    
    count = 0
    for private_key in private_keys:
        for to_address in addresses:
            if await send_transaction(private_key, to_address, amount, language):
                count += 1
            await asyncio.sleep(random.uniform(1 , 1))  # Delay acak 1 detik
    
    print(f"{Fore.YELLOW}Total transaksi berhasil: {count}{Style.RESET_ALL}")
    return count

# Fungsi utama
async def run(language):
    print(f"{Fore.GREEN}{'═' * 60}{Style.RESET_ALL}")
    print(f"{Fore.GREEN}│ {'SEND TX - MONAD TESTNET':^56} │{Style.RESET_ALL}")
    print(f"{Fore.GREEN}{'═' * 60}{Style.RESET_ALL}")

    private_keys = load_private_keys('pvkey.txt')
    if not private_keys:
        return

    print(f"{Fore.CYAN}👥 {'Akun' if language == 'id' else 'Accounts'}: {len(private_keys)}{Style.RESET_ALL}")

    while True:
        try:
            print_border("🔢 JUMLAH TRANSAKSI", Fore.YELLOW)
            tx_count_input = input(f"{Fore.GREEN}➤ Masukkan jumlah transaksi (default 5): {Style.RESET_ALL}")
            tx_count = int(tx_count_input) if tx_count_input.strip() else 5
            if tx_count <= 0:
                raise ValueError
            break
        except ValueError:
            print(f"{Fore.RED}❌ Harap masukkan angka valid!{Style.RESET_ALL}")

    while True:
        try:
            print_border("💰 JUMLAH MONAD", Fore.YELLOW)
            amount_input = input(f"{Fore.GREEN}➤ Masukkan jumlah MONAD (default 0.000001, max 999): {Style.RESET_ALL}")
            amount_input = amount_input.replace(',', '.')  # Ganti koma dengan titik
            amount = float(amount_input) if amount_input.strip() else 0.0000001
            if 0 < amount <= 999:
                break
            raise ValueError
        except ValueError:
            print(f"{Fore.RED}❌ Jumlah harus lebih dari 0 dan tidak melebihi 999!{Style.RESET_ALL}")

    while True:
        print_border("🔧 PILIH JENIS TRANSAKSI", Fore.YELLOW)
        print(f"{Fore.CYAN}1. Kirim ke alamat acak{Style.RESET_ALL}")
        print(f"{Fore.CYAN}2. Kirim ke alamat dari file (address.txt){Style.RESET_ALL}")
        choice = input(f"{Fore.GREEN}➤ Pilihan (1/2): {Style.RESET_ALL}")

        if choice == '1':
            await send_to_random_addresses(amount, tx_count, private_keys, language)
            break
        elif choice == '2':
            addresses = load_addresses('address.txt')
            if addresses:
                await send_to_file_addresses(amount, addresses, private_keys, language)
            break
        else:
            print(f"{Fore.RED}❌ Pilihan tidak valid!{Style.RESET_ALL}")

    print(f"{Fore.GREEN}{'═' * 60}{Style.RESET_ALL}")
    print(f"{Fore.GREEN}│ {'SELESAI' if language == 'id' else 'ALL DONE'} │{Style.RESET_ALL}")
    print(f"{Fore.GREEN}{'═' * 60}{Style.RESET_ALL}")

# Menjalankan program
if __name__ == "__main__":
    asyncio.run(run('id'))

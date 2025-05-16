import asyncio
import main

async def run():
    if hasattr(main, "main"):
        await main.main()  # Gunakan await untuk coroutine
    else:
        print("main tidak punya fungsi main()")

asyncio.run(run())  # Jalankan event loop async

"""
Management command: seed_stalls
Clears old stall records (if no bookings) and creates stalls 1-33
matching the new Defence Expo floor map.

Usage:
    python manage.py seed_stalls              # Safe mode (prints preview)
    python manage.py seed_stalls --apply      # Actually write to DB
"""

from django.core.management.base import BaseCommand
from exhibitions.models import Stall, ExhibitorRegistration


STALL_PRICE = 20_000.00          # ₹20,000 per stall
STALL_SIZE  = "3x3 Mtr."         # updated default
TOTAL       = 33                  # stalls 1–33


class Command(BaseCommand):
    help = "Seed Defence Expo stalls (1–33) matching the new floor map."

    def add_arguments(self, parser):
        parser.add_argument(
            "--apply",
            action="store_true",
            help="Actually modify the database (default is dry-run).",
        )
        parser.add_argument(
            "--price",
            type=float,
            default=STALL_PRICE,
            help=f"Price per stall (default: {STALL_PRICE})",
        )

    def handle(self, *args, **options):
        apply  = options["apply"]
        price  = options["price"]

        existing = Stall.objects.count()
        booked   = ExhibitorRegistration.objects.count()

        self.stdout.write(f"Existing stalls : {existing}")
        self.stdout.write(f"Existing bookings: {booked}")

        if not apply:
            self.stdout.write(self.style.WARNING(
                f"\nDRY-RUN: Would delete {existing} stall(s) and create 33 new ones "
                f"(1–33 @ ₹{price:,.0f} each).\n"
                "Re-run with --apply to commit changes."
            ))
            return

        # Safety check
        if booked > 0:
            self.stdout.write(self.style.ERROR(
                f"Cannot seed: {booked} booking(s) still reference existing stalls. "
                "Reassign or delete bookings first."
            ))
            return

        # Delete all existing stalls
        deleted, _ = Stall.objects.all().delete()
        self.stdout.write(f"Deleted {deleted} existing stall(s).")

        # Create stalls 1–33
        stalls = [
            Stall(stall_number=str(n), size=STALL_SIZE, price=price, block=None)
            for n in range(1, TOTAL + 1)
        ]
        Stall.objects.bulk_create(stalls)
        self.stdout.write(self.style.SUCCESS(
            f"Created {TOTAL} stalls (1–{TOTAL}) at ₹{price:,.0f} each."
        ))

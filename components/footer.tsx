"use client"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary/20 to-secondary/20 border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
              <span className="material-icons">contact_support</span> Contact Us
            </h3>
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <span className="material-icons text-base">email</span> info@mannatemple.co.za
            </p>
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              <span className="material-icons text-base">phone</span> +27 73 851 4499
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="material-icons text-base">language</span> www.mannatemple.co.za
            </p>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
              <span className="material-icons">location_on</span> Location
            </h3>
            <p className="text-sm text-muted-foreground">83VC+8WX The Orchards</p>
            <p className="text-sm text-muted-foreground">Akasia, Pretoria North</p>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
              <span className="material-icons">schedule</span> Sunday Services
            </h3>
            <p className="text-sm text-muted-foreground mb-1">Intercession: 9 am - 10 am</p>
            <p className="text-sm text-muted-foreground mb-1">Main: 10 am - 1 pm</p>
            <p className="text-sm text-muted-foreground">Deliverance: 1 pm - 2 pm</p>
          </div>

          {/* Banking */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
              <span className="material-icons">volunteer_activism</span> Sow A Seed
            </h3>
            <p className="text-xs text-muted-foreground mb-1">Bank: Standard Bank</p>
            <p className="text-xs text-muted-foreground mb-1">Acc: 10151728613</p>
            <p className="text-xs text-muted-foreground mb-1">Holder: Manna Temple Church</p>
            <p className="text-xs text-muted-foreground">Code: 000205</p>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">© 2026 Manna Radio & TV. All rights reserved. | coded by EricKingLipaz +2776 455 6648</p>
        </div>
      </div>
    </footer>
  )
}

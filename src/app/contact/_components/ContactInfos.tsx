import { InfoItem } from "./InfoItem";
import {
  IconLocation,
  IconCalendar,
  IconMail,
  IconPhone,
} from "@/src/components/ui/Icons";

export function ContactInfos() {
  return (
    <div>
      <h2 className="font-display text-4xl text-noir red-line mb-8">
        Informations
      </h2>
      <div className="space-y-8">
        <InfoItem icon={<IconLocation size={22} />} titre="Adresse">
          <p>Place de la Liberté</p>
          <p>Saint-Martin-d'Hères (38400)</p>
          <p className="text-sm text-gris mt-0.5">Entrée côté église</p>
          <a
            href="https://maps.google.com/?q=Place+de+la+Liberté+Saint-Martin-d'Hères"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red text-sm hover:underline mt-1 block"
          >
            Voir sur Google Maps →
          </a>
        </InfoItem>

        <InfoItem icon={<IconCalendar size={22} />} titre="Horaires">
          <p className="font-semibold text-noir">Tous les mardis</p>
          <p className="text-gris text-sm">Hors vacances scolaires</p>
          <ul className="mt-2 space-y-1 text-sm">
            {[
              { h: "18h–19h", label: "Cours jeunes" },
              { h: "19h–20h", label: "Cours adultes" },
              { h: "20h–22h", label: "Jeu libre" },
            ].map(({ h, label }) => (
              <li key={h} className="flex items-center gap-2">
                <span className="text-red font-semibold">{h}</span>
                <span className="text-gris">{label}</span>
              </li>
            ))}
          </ul>
        </InfoItem>

        <InfoItem icon={<IconMail size={22} />} titre="Email">
          <a
            href="mailto:echiquier.martinerois@gmail.com"
            className="text-red hover:underline break-all"
          >
            echiquier.martinerois@gmail.com
          </a>
        </InfoItem>

        <InfoItem icon={<IconPhone size={22} />} titre="Président">
          <p className="text-noir">Gabriel Guillon</p>
          <a href="tel:+33671888053" className="text-red hover:underline">
            06 71 88 80 53
          </a>
        </InfoItem>
      </div>
    </div>
  );
}

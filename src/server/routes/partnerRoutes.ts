import { Router } from 'express';
import { sandboxStore } from '../adapters/sandboxStore.js';
import { authenticate, AuthenticatedRequest, requireRole } from '../middleware/auth.js';

const router = Router();

// Get partners
router.get('/', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user!;
    const filterBusiness = user.role === 'SUPER_ADMIN' ? undefined : user.businessId;
    const partners = await sandboxStore.getPartners(filterBusiness);
    res.json(partners);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create partner
router.post(
  '/',
  authenticate,
  requireRole('BUSINESS_OWNER', 'SUPER_ADMIN'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      const partner = await sandboxStore.createPartner(req.body, user);
      res.status(201).json(partner);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create partner.' });
    }
  }
);

// Update partner
router.put(
  '/:id',
  authenticate,
  requireRole('BUSINESS_OWNER', 'SUPER_ADMIN'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      const { id } = req.params;
      const updated = await sandboxStore.updatePartner(id, req.body, user);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update partner.' });
    }
  }
);

// Delete / de-activate partner
router.delete(
  '/:id',
  authenticate,
  requireRole('BUSINESS_OWNER', 'SUPER_ADMIN'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const user = req.user!;
      const { id } = req.params;
      const result = await sandboxStore.deletePartner(id, user);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to delete partner.' });
    }
  }
);

export default router;
